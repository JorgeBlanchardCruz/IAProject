using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GeneradorMapa
{
    public partial class Form1 : Form
    {
      private string entrada;
      private Cuadricula tab_;
      private int selected_;

        public Form1()
        {
            entrada = null;
            selected_ = -1;
           // _C = new System.Windows.Forms.Label(); ;
            tab_ = new Cuadricula(0, 0, this);
            InitializeComponent();
            //this.Opacity = .75;
            this.WindowState = FormWindowState.Maximized;
            Paleta a = new Paleta();
            a.Show();
        }

        private void crearToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Form2 f = new Form2(this);
            f.Show();
        }
        public void CrearTabla()
        {
            string [] cad = entrada.Split('x');
            bool ok = true;
            try
            {
                Convert.ToInt32(cad[0]);
                Convert.ToInt32(cad[1]);
            }
            catch (FormatException)
            {
                ok = false;
                MessageBox.Show("Debe ser formato FILASxCOLUMNAS");
            }
       
            if (ok)
            {
                tab_ = new Cuadricula(Convert.ToInt32(cad[0]), Convert.ToInt32(cad[1]), this);
                for (int i = 0; i < tab_.get_rows(); i++)
                {
                    for (int j = 0; j < tab_.get_columns(); j++)
                    {
                        this.Controls.Add(this.tab_.get_Celda(i, j));
                        this.tab_.get_Celda(i, j).Click += new System.EventHandler(this.tab_.get_Celda(i, j).Celda_Click);
                    }
                }

            }    
        }
        public string getent() { return entrada; }
        public void setent(string s) {  entrada = s; }
        public int get_selected() { return selected_; }
        private void Form1_Paint(object sender, PaintEventArgs e)
        {
          
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
        
        private void pictureBox1_Click(object sender, EventArgs e)
        {
        //    this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.rojo;
        }
        private void pic1_Click(object sender, EventArgs e)
        {
            this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blancoM;
            
            switch (selected_)
            {
                case 1: this.pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojo; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azul; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 4: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verde; break;
                default: break;
            }
            selected_ = 0;
        }
        private void pic2_Click(object sender, EventArgs e)
        {
            this.pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojoM;
            switch (selected_)
            {
                case 0: pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blanco; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azul; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 4: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verde; break;
            }
            selected_ = 1;
        }
        private void pic3_Click(object sender, EventArgs e)
        {
            this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azulM;
            switch (selected_)
            {
                case 1: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojo; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blanco; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 4: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verde; break;
            }
            selected_ = 2;
        }
        private void pic4_Click(object sender, EventArgs e)
        {
            this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.waterM;
            switch (selected_)
            {
                case 1: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojo; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azul; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blanco; break;
                case 4: this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verde; break;
            }
            selected_ = 3;
        }
        private void pic5_Click(object sender, EventArgs e)
        {
            this.pictureBox5.Image = global::GeneradorMapa.Properties.Resources.verdeM;
            switch (selected_)
            {
                case 1: pictureBox2.Image = global::GeneradorMapa.Properties.Resources.rojo; break;
                case 2: this.pictureBox3.Image = global::GeneradorMapa.Properties.Resources.azul; break;
                case 3: this.pictureBox4.Image = global::GeneradorMapa.Properties.Resources.water; break;
                case 0: this.pictureBox1.Image = global::GeneradorMapa.Properties.Resources.blanco; break;
            }
            selected_ = 4;
        }
    }
}
